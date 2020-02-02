package com.beerwithai.glimpse.UnitTest;

import android.content.Context;

import com.beerwithai.glimpse.Engine.Engine;
import com.facebook.react.bridge.ReactApplicationContext;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

import java.io.File;

import io.realm.Realm;

import static org.mockito.Mockito.when;


public class EngineTests {

    @Mock
    ReactApplicationContext context;

    @Rule
    public MockitoRule rule = MockitoJUnit.rule();

    @Before
    public void setup() {
        Context c = Mockito.mock(Context.class);
        when(c.getFilesDir()).thenReturn(new File("/"));
        Realm.init(c);
    }

    @Test
    public void RunEngine() {
        try {
            Engine Instance = new Engine();
            Instance.Initialize(context);
            assert (true);
        } catch (Exception e) {
            assert (false);
        }
    }

    @After
    public void bye() {

    }
}
